# Bible References to Links

Automatically convert bare Bible references to Obsidian links. This is meant to work in conjunction with a Bible (with structure similar to the [Bible Study Kit](https://forum.obsidian.md/t/bible-study-in-obsidian-kit-including-the-bible-in-markdown/12503)) already in your vault.

## Disclaimer

This plugin is still in an early stage. I use it personally and extensively, but it is still relatively untested (especially outside of my own hands). Always keep backups of your vault, that's just good practice.

## Usage

Use the `Detect and convert Bible references to links` command from the command palette, editor toolbar (on mobile), or keybinding of your choice to trigger this plugin's functionality. Any references detected in your active document (or selection, if any) into links.

Supported functionalities include abbreviated book names (e.g. Phm = Philemon, 1Co = 1 Corinthians), multiple verses from the same chapter (e.g. Php 4:4, 13) or book (e.g. Matthew 5:48; 6:33), verse ranges (Matthew 5:3-11, 14-16).

These links assume that you have each chapter stored as a different file with the full book name and chapter number (i.e. Genesis 1.md, Genesis 2.md, etc.), with each verse being a heading of any level in each file, consisting only of the verse number (i.e. `# 1` for verse 1, `# 2` for verse 2, etc.). On the input end, it is assumed that references are separated by commas or semicolons and chapters are denoted by colons, that is, `8:13, 14, 9:15` denotes "chapter 8 verses 13 and 14, chapter 9 verse 15). Customization of all these assumptions (symbols, heading format and structure, file naming and structure) may come in a later release.

## Examples

| Before | After |
| -- | -- |
| Gen 1:1 | `[[Genesis 1#1|Gen 1:1]]` |
| Gen 1:1-3 | `[[Genesis 1#1|Gen 1:1-3]][[Genesis 1#2|]][[Genesis 1#3|]]` |
| Gen 1:1-3, 13, 14, 25-26 | `[[Genesis 1#1|Gen 1:1-3]][[Genesis 1#2|]][[Genesis 1#3|]], [[Genesis 1#13|13]], [[Genesis 1#14|14]], [[Genesis 1#25|25-26]][[Genesis 1#26|]]` |
| Gen 1:1-3; 2:1-4, 7, 9; 3:5-6 | `[[Genesis 1#1|Gen 1:1-3]][[Genesis 1#2|]][[Genesis 1#3|]]; [[Genesis 2#1|2:1-4]][[Genesis 2#2|]][[Genesis 2#3|]][[Genesis 2#4|]], [[Genesis 2#7|7]], [[Genesis 2#9|9]]; [[Genesis 3#5|3:5-6]][[Genesis 3#6|]]` |
| Gen 1:1-3; Exo 5:9; 6:7 | `[[Genesis 1#1|Gen 1:1-3]][[Genesis 1#2|]][[Genesis 1#3|]]; [[Exodus 5#9|Exo 5:9]]; [[Exodus 6#7|6:7]]` |

## License

MIT
