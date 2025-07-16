sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/m/MessageToast",
  "sap/ui/core/format/DateFormat",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, ODataModel, MessageToast, DateFormat, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("ZQUALITY_PM.controller.Result", {

    onInit: function () {
      this._loadResultData(""); // Load all data initially
    },

    _loadResultData: function (sCategory) {
      var oModel = new ODataModel("/sap/opu/odata/sap/ZODATA_QUALITY_PM_SRV/");
      var aFilters = [];

      if (sCategory) {
        aFilters.push(new Filter("ResultCategory", FilterOperator.EQ, sCategory));
      }

      var that = this;
      oModel.read("/QualityResult", {
        filters: aFilters,
        success: function (oData) {
          var oJson = new JSONModel(oData.results);
          that.getView().setModel(oJson, "resultModel");
        },
        error: function () {
          MessageToast.show("Error fetching Quality Result data.");
        }
      });
    },

    onResultFilterChange: function (oEvent) {
      var sKey = oEvent.getSource().getSelectedKey();
      this._loadResultData(sKey);
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("Home");
    },

    formatDate: function (sDate) {
      if (!sDate) return "";
      var oDate = new Date(sDate);
      return DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(oDate);
    }

  });
});
