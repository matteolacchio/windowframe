export default (() => {
    return {
        get TestFunction(){
            return () => { console.log('test successful'); }
        },
        set TestFunction(value){ throw 'TestFunction is readonly'; }
    }
})();