export type TypeCastConverter = (s: string) => any;
export type TypeCastConverterList = {
    [key: string]: TypeCastConverter;
};
// tslint:disable-next-line: variable-name
export const typeCastConverter_Date: TypeCastConverter = (s: string) => {
    if (isNaN(Date.parse(s))) throw new Error('not a valid Date');
    return new Date(s);
};

export const typeCast = (
    masterObject: object,
    newObject: object,
    converters: TypeCastConverterList = {}
): object => {
    const funcName = typeCast.name;
    const result = { ...masterObject };

    for (const key of Object.keys(newObject)) {
        if (!(key in masterObject)) throw new Error(`${funcName}(${key}): not found`);
        // @ts-expect-error
        const masterType = typeof masterObject[key];
        // @ts-expect-error
        const stringValue = newObject[key].toString();
        let newValue = stringValue;

        if (key in converters) {
            try {
                // @ts-expect-error
                result[key] = converters[key](stringValue);
            } catch (e) {
                throw new Error(`${funcName}(${key}) "${stringValue}" -> ${e.message}`);
            }
            continue;
        }

        switch (masterType) {
            case 'string':
                break;
            case 'number':
                newValue = parseInt(stringValue, 10);
                if (isNaN(stringValue))
                    throw new Error(`${funcName}(${key}): "${stringValue}" -> not a number`);
                break;
            case 'boolean':
                newValue = stringValue === 'true';
                break;
            default:
                throw new Error(
                    `${funcName}(${key}): "${stringValue}" -> type "${masterType}" not supported`
                );
        }
        // @ts-expect-error
        result[key] = newValue;
    }
    return result;
};
