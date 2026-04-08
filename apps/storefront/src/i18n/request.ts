
export default getRequestConfig(async () => {
    // Always use 'en' since we don't need translations
    return {
        locale: 'en',
        messages: {},
    };
});
