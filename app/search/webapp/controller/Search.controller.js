sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
     "sap/ui/model/odata/v2/ODataModel",
], (Controller,JSONModel, ODataModel) => {
    "use strict";

    return Controller.extend("com.ram.search.controller.Search", {
        onInit() {
            var sServiceUrl = "/odata/v2/user/";
            this.oModel = new ODataModel(sServiceUrl, true);
            this.getView().setModel(this.oModel);
        },

        formatHighlightedText: function (sText) {
            var searchValue = this.getView().byId("searchField").getValue().trim();
            if (!searchValue || !sText) {
              return sText; // Return original text if no search value
            }
            
            var regex = new RegExp("(" + searchValue + ")", "gi"); // Case insensitive match
            return sText.replace(regex, '<span class="highlighted">$1</span>'); // Wrap matches in span
          },
      
          onLiveChange: function (oEvent) {
      
            //var oSearchField = this.byId("searchField");
            //oSearchField.setEnabled(true);
            //console.log("Search field enabled state before:", oSearchField.getEnabled());
      
      
            var oBusyIndicator = this.byId("busyIndicator");
            oBusyIndicator.setVisible(true);
      
            // setTimeout(function () {
            //   oBusyIndicator.setVisible(false);
            // }, 500); 
      
            var searchValue = oEvent.getParameter("newValue").trim();
            //var oTable = this.getView().byId("userTable");
      
            if (searchValue === "") {
              //oTable.setModel(new JSONModel({ Users: [] }), "users");
              this._clearPopover();
              this._clearTable();
              oBusyIndicator.setVisible(false);
              return
            }
      
            // Read filtered data from backend
            if (searchValue.length >=2) {
              this._clearPopover();
            this.oModel.read("/users", {
              method: "GET",
              urlParameters: {
                searchValue: searchValue,
              },
              success: (oData) => {
                //console.log(oData);
                if(oData.results.length===1 || oData.results.length===0){
                  var scroll=this.getView().byId("scroll");
                  scroll.setHeight("30px");
                  scroll.setVertical(false);
                }
                else{
                  var scroll=this.getView().byId("scroll");
                  scroll.setHeight("250px");
                  scroll.setVertical(true);
                }
                var oJSONModel = new JSONModel(oData);
                //oTable.setModel(oJSONModel, "users");
      
                //console.log("oJsonmodel",oJSONModel);
      
                this.getView().setModel(oJSONModel, "users");
                this._openPopover(oJSONModel, oEvent.getSource());
                //oSearchField.setEnabled(true);
                oBusyIndicator.setVisible(false);
                //console.log("Search field enabled state after success:", oSearchField.getEnabled());
      
                //console.log("Filtered data loaded:", oData);
              },
              error: (oError) => {
                console.error("Error loading filtered data:", oError);
                this._clearPopover();
                oBusyIndicator.setVisible(false);
              }
            });
          }
          else{
            oBusyIndicator.setVisible(false);
            this._clearPopover();
          }
          },
      
          onItemPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oContext = oItem.getBindingContext("users");
            var oSelectedData = oContext.getObject();
          
            //console.log("Selected Item Data:", oSelectedData);
          
            var oTable = this.byId("userTable");
            var oTableModel = new JSONModel({ selectedUser: [oSelectedData] });
            oTable.setModel(oTableModel, "selectedUser");
      
            oTable.setVisible(true);
      
      
            this._clearPopover();
        
            //console.log("Table Model Set:", oTableModel.getData());
          },
      
          // _openPopover: function (oModel, oSource) {
          //   var oSearchField = this.byId("searchField");
          //   //console.log("Search field enabled state before popover:", oSearchField.getEnabled());
      
          //   var oPopover = this.byId("userPopover");
          //   oPopover.setModel(oModel, "users");
          //   oPopover.openBy(oSource);
      
          //   //console.log("Search field enabled state after popover:", oSearchField.getEnabled());
      
          //   oSearchField.setEnabled(true);
          //   oSearchField.focus();
          // },
      
          _openPopover: function (oModel, oSource) {
            var oSearchField = this.byId("searchField");
            //console.log("Search field enabled state before popover:", oSearchField.getEnabled());
          
            var oPopover = this.byId("userPopover");
            oPopover.setModel(oModel, "users");
          
            // Attach the afterOpen event
            oPopover.attachAfterOpen(function() {
              oSearchField.setEnabled(true);
              oSearchField.focus();
              //console.log("Search field enabled state after popover:", oSearchField.getEnabled());
            });
          
            oPopover.openBy(oSource);
          },
      
      
          _clearPopover: function () {
            var oPopover = this.byId("userPopover");
            if (oPopover) {
              oPopover.close();
            }
          },
      
          _clearTable: function () {
            var oTable = this.byId("userTable");
            var oTableModel = new JSONModel({ selectedUser: [] });
            oTable.setModel(oTableModel, "selectedUser");
      
            oTable.setVisible(false);
      
          },
      
    });
});