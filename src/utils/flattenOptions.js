export default function flattenOptions(options, ancestor=[]){
    let flatOptions = []
    options.forEach((option) => {
        const optionStack = ancestor.concat(option)
        if(!option.children){
            flatOptions=[...new Set([...flatOptions, ...optionStack])]
        } else {
            flatOptions = flatOptions.concat(flattenOptions(option.children, optionStack))
        }
    })
    return flatOptions
}