({
    fetchAcc : function(component, event, helper) {
        helper.fetchAccHelper(component, event, helper);
    },
    deleteRow:function (component, event, helper) {
        debugger;
        var a=event.getSource().get("v.tabindex");
         console.log("Check",event.getSource().get("v.tabindex"));
    }
})