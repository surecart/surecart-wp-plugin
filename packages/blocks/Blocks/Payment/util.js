export const hasProcessor = (type) => {
	return scBlockData?.processors.some((p) => p.processor_type === type);
};
