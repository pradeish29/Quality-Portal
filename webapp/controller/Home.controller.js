sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Configuration",
  "sap/m/MessageToast"
], function (Controller, JSONModel, Configuration, MessageToast) {
  "use strict";

  return Controller.extend("ZQUALITY_PM.controller.Home", {

    onInit: function () {
      this._loadUserContext();

      // Persisted Theme Load
      const savedTheme = localStorage.getItem("ui5Theme");
      if (savedTheme) {
        sap.ui.getCore().applyTheme(savedTheme);
      }
    },

    _loadUserContext: function () {
      var oUserModel = new JSONModel({
        name: "Welcome, Trainee",
        now: new Date()
      });
      this.getView().setModel(oUserModel, "userModel");
    },

    onNavigate: function (oEvent) {
      var sRoute = oEvent.getSource().getCustomData()[0].getValue();
      if (sRoute) {
        this.getOwnerComponent().getRouter().navTo(sRoute);
      }
    },

    onLogout: function () {
      MessageToast.show("Logging out...");
      this.getOwnerComponent().getRouter().navTo("Login");
    },

    onToggleTheme: function () {
      const currentTheme = Configuration.getTheme();
      const newTheme = currentTheme.includes("dark") ? "sap_fiori_3" : "sap_fiori_3_dark";

      sap.ui.getCore().applyTheme(newTheme);
      localStorage.setItem("ui5Theme", newTheme);

      MessageToast.show(`Switched to ${newTheme}`);
    }

  });
});
