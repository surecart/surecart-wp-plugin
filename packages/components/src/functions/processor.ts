export const getProcessorData = (processors = [], type, mode) => {
  return (processors || []).find(processor => processor?.processor_type === type && processor?.live_mode === !!(mode === 'live'))?.processor_data;
};
