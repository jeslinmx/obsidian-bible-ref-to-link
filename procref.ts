import { bookAbbreviationMapping } from "books"
import { anyOf, charIn, createRegExp, digit, maybe, oneOrMore, whitespace } from "magic-regexp"

interface MatchContext {
	book: RegExpMatchArray | null
	chapter: RegExpMatchArray | null
	verse: RegExpMatchArray | null
}

// Regexps
const ws = whitespace.times.any()
const wrapws = (re: never) => ws.and(re).and(ws)
const bookToken: RegExp = createRegExp(
	maybe("!").as("embed").and(anyOf(...bookAbbreviationMapping.keys()).as("book")).and(ws)
, ["i"])
const chapterToken: RegExp = createRegExp(
	oneOrMore(digit).as("chapter").and(wrapws(":"))
	.at.lineStart()
)
const verseToken: RegExp = createRegExp(
	(oneOrMore(digit).as("verseStart"))
	.and(maybe(wrapws("-").and(oneOrMore(digit).as("verseEnd"))))
	.at.lineStart()
)
const separator: RegExp = createRegExp(
	wrapws(charIn(",;")).at.lineStart()
)
const bookTokenImmediateVicinity = new RegExp("^" + bookToken.source, bookToken.flags)

function range(start: number, end: number): number[] {
	return [...Array(end - start + 1).keys()].map(x => start + x)
}

function constructLinkFrom(bookMatch: RegExpMatchArray, chapterMatch: RegExpMatchArray, verseMatch: RegExpMatchArray, embed = false): string {
	const bookToken = bookMatch[0]
	const chapterToken = chapterMatch[0]
	const verseToken = verseMatch[0]

	const { book } = bookMatch.groups
	const { chapter } = chapterMatch.groups
	const { verseStart, verseEnd } = verseMatch.groups
	const canonicalBook = bookAbbreviationMapping.get(book.toLowerCase())
	const verses = range(Number(verseStart), Number(verseEnd ?? verseStart))

	const verseAddress = (verse: number) => `${canonicalBook} ${chapter}#${verse}`
	const verseDisplayText = [bookToken, chapterToken, verseToken].join("")

	return verses.map(
		(verse: number, i: number) =>
		embed
		? `![[${verseAddress(verse)}]]`
		: `[[${verseAddress(verse)}|${(i == 0 || embed) ? verseDisplayText : ""}]]`
	).join("")
}

export function scanAndProcessTokens(input: string) {
	const outputStack: string[] = []
	const ctx: MatchContext = {
		"book": null,
		"chapter": null,
		"verse": null
	}
	let remaining = input
	while (remaining) {
		if (ctx.book === null) {
			// STATE 1: no book, chapter or verse
			// search for book, not necessarily from start of line
			// if book not found, flush remaining and exit
			// else, flush text up to book, assign to context, truncate remaining, and go to STATE 2
			ctx.book = remaining.match(bookToken)
			console.debug("STATE 1:\n", remaining, ctx.book)
			if (ctx.book === null) {
				outputStack.push(remaining)
				break
			}
			else {
				outputStack.push(remaining.substring(0, ctx.book?.index))
				remaining = remaining.substring(ctx.book?.index + ctx.book[0].length)
			}
		}
		else if (ctx.chapter === null) {
			// STATE 2: book, no chapter or verse
			// search for chapter
			// if chapter not found, flush book and go to STATE 1
			// else, assign to context, truncate remaining, and go to STATE 3
			ctx.chapter = remaining.match(chapterToken)
			console.debug("STATE 2:\n", remaining, ctx.chapter)
			if (ctx.chapter === null) {
				outputStack.push(ctx.book[0])
				ctx.book = null
			}
			else {
				remaining = remaining.substring(ctx.chapter[0].length)
			}
		}
		else if (ctx.verse === null) {
			// STATE 3: book, chapter, no verse
			// search for verse
			// if verse not found, flush book and chapter and go to STATE 1
			// else, assign to context, create link, truncate remaining, and go to STATE 4
			ctx.verse = remaining.match(verseToken)
			console.debug("STATE 3:\n", remaining, ctx.verse)
			if (ctx.verse === null) {
				outputStack.push(ctx.book[0], ctx.chapter[0])
				ctx.book = ctx.chapter = null
			}
			else {
				outputStack.push(constructLinkFrom(ctx.book, ctx.chapter, ctx.verse, Boolean(ctx.book.groups?.embed)))
				remaining = remaining.substring(ctx.verse[0].length)
			}
		}
		else {
			// STATE 4: book, chapter, verse; looking for separator
			// search for separator
			// if not found, clear book, chapter and verse, and go to STATE 1
			// else, flush separator, truncate remaining, and lookahead for book, chapter or verse; go to STATE 1, 2 or 3 respectively
			const sep = remaining.match(separator)
			console.debug("STATE 4:\n", remaining, sep)
			if (sep === null) {
				ctx.book = ctx.chapter = ctx.verse = null
			}
			else {
				if (!ctx.book.groups?.embed) outputStack.push(sep[0])
				remaining = remaining.substring(sep[0].length)
				let lookahead: RegExpMatchArray | null
				if ((lookahead = remaining.match(bookTokenImmediateVicinity))) {
					console.debug("book found in lookahead:", lookahead)
					ctx.book = ctx.chapter = ctx.verse = null
				}
				else if ((lookahead = remaining.match(chapterToken))) {
					console.debug("chapter found in lookahead:", lookahead)
					ctx.book[0] = ""
					ctx.chapter = ctx.verse = null
				}
				else {
					ctx.book[0] = ctx.chapter[0] = ""
					ctx.verse = null
				}
			}
		}
	}
	return outputStack.join("")
}
