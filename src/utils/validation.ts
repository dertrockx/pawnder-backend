export const validRequiredFields = (
	fields: string[],
	obj: { [key: string]: any }
): boolean => {
	const keys = Object.keys(obj);
	console.log(keys);
	return fields.every((field) => keys.includes(field));
};
