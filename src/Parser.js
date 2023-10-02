const replacements = {
    '\\[b\\](.+?)\\[/b\\]': `<span class="font-bold">$1</span>`,
    '\\[ul\\](.+?)\\[/ul\\]': `<span class="underline">$1</span>`,
    '\\[i\\](.+?)\\[/i\\]': `<span class="italic">$1</span>`,
    '\n': '<br>',
    '\\[\\[(.+?)\\|(.+?)\\]\\]': `<a href="javascript:void(1)" data-cmd="$1">$2</a>`,
}

export default (text) => {
    // Parse a string according to above rules
    let v = text
    for (const regex in replacements) {
        const replacement = replacements[regex]
        v = v.replace(new RegExp(regex, 'gms'), replacement)
    }

    return v
}