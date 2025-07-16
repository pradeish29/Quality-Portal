sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/m/MessageToast",
  "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, ODataModel, MessageToast, DateFormat) {
  "use strict";

  return Controller.extend("ZQUALITY_PM.controller.Inspection", {

    onInit: function () {
      this._fetchData(""); // Load all by default
    },

    _fetchData: function (sFilterKey) {
      var oODataModel = new ODataModel("/sap/opu/odata/sap/ZODATA_QUALITY_PM_SRV/");
      var sPath = "/QualityInspection";
      var mParams = {};

      if (sFilterKey) {
        var statusMap = {
          "A": "Approved",
          "R": "Rejected",
          "P": "Yet to Decide"
        };
        mParams.filters = [
          new sap.ui.model.Filter("ApprovalStatus", "EQ", statusMap[sFilterKey])
        ];
      }

      var that = this;
      oODataModel.read(sPath, {
        filters: mParams.filters || [],
        success: function (oData) {
          var oModel = new JSONModel(oData);
          that.getView().setModel(oModel, "inspectionModel");
        },
        error: function () {
          MessageToast.show("Failed to load data from OData service.");
        }
      });
    },

    onFilterChange: function (oEvent) {
      var sKey = oEvent.getSource().getSelectedKey();
      this._fetchData(sKey);
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("Home");
    },

    formatStatus: function (sStatus) {
      switch (sStatus) {
        case "Approved": return "Success";
        case "Rejected": return "Error";
        case "Yet to Decide": return "Warning";
        default: return "None";
      }
    },

    formatDate: function (sDate) {
      if (!sDate) return "";
      var oDate = new Date(sDate);
      return DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(oDate);
    }
  });
});
