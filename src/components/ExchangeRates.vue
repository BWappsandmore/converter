<template>
  <!-- modal template  -->
  <modal-template
    v-if="showModal"
    :showModal="showModal"
    @keyup.esc="clearAlert()"
    tabindex="-1"
  >
    <template v-slot:header>
      <h5 class="modal-title" id="modalTemplateTitle">
        {{ modalTitle }}
      </h5>
    </template>
    <template v-slot:header-btn
      ><button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal-template"
        @click="closeModal()"
        aria-label="Close"
      ></button
    ></template>
    <template v-slot:body>
      <div class="table-responsive">
        <table class="table table-borderless align-middle" v-if="showEditBtn">
          <tbody>
            <tr v-for="(k, index) of keys" :key="k.id">
              <td>{{ k }}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  v-model="values[index].rate"
                  :disabled="whenBase(selected, k)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-responsive">
        <table class="table table-borderless align-middle" v-if="showCreateBtn">
          <tbody>
            <tr>
              <td>
                <p>Währung:</p>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  placeholder="US-Dollar ($)"
                  v-model="valueName"
                />
              </td>
            </tr>
            <tr>
              <td>
                <p>ISO-Code:</p>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  placeholder="USD"
                  v-model="valueISOCode"
                />
              </td>
            </tr>
            <tr>
              <td>
                <p>Land:</p>
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  placeholder="USA"
                  v-model="valueCountry"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:footer-left>
      <button type="button" class="btn btn-secondary" @click="closeModal()">
        Abbrechen
      </button>
    </template>
    <template v-slot:footer-right>
      <button
        type="button"
        v-if="showEditBtn"
        class="btn btn-primary"
        @click="performApiCall('edit')"
      >
        Ändern
      </button>
      <button
        type="button"
        v-if="showCreateBtn"
        class="btn btn-success"
        @click="performApiCall('create')"
      >
        Hinzufügen
      </button>
    </template>
  </modal-template>
  <!-- main layout -->
  <div class="container-fluid">
    <div class="row">
      <div class="col text-center">
        <modal-alert v-if="showAlert" :showAlert="showAlert">
          <template v-slot:msgBody>
            {{ alertMsg }}
          </template>
        </modal-alert>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <div class="table-responsive">
          <table class="table table-borderless align-middle">
            <tbody>
              <tr>
                <td>
                  <p class="pt-3">Währung aus der Liste wählen:</p>
                </td>
                <td>
                  <select
                    class="form-select"
                    v-if="currencyLoaded"
                    v-model="selected"
                    @change="changeCurrency($event)"
                  >
                    <option
                      v-for="item of currency"
                      :key="item.id"
                      :value="item.ISOcode"
                    >
                      {{ item.ISOcode }}&nbsp;-&nbsp;{{ item.currency }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-responsive">
          <table
            class="table table-bordered border border-light border-1 align-middle"
          >
            <thead class="table-light">
              <tr>
                <td></td>
                <td v-for="k of keys" :key="k.id">{{ k }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1&nbsp;{{ this.selected }}</td>
                <td v-for="val of values" :key="val.id">
                  {{ val.rate }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-grid d-md-flex justify-content-between">
          <button
            type="button"
            class="btn btn-primary mt-1"
            @click="redirectTo('/')"
          >
            Wechselrechner
          </button>

          <button
            type="button"
            class="btn btn-warning me-1"
            @click="passContents('edit')"
          >
            Ändern
          </button>
        </div>
      </div>
      <div class="col-sm-2">
        <button
          class="btn btn-success mt-3"
          type="button"
          @click="passContents('create')"
        >
          Neu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // boolean variables
      currencyLoaded: Boolean,
      ratesLoaded: Boolean,

      // api response data arrays
      currency: [],
      rates: [],

      //v-model variables - init values
      selected: "EUR",
      ratesBaseSelected: [],
      keys: [],
      values: [],

      valueName: "",
      valueISOCode: "",
      valueCountry: "",
      storeISOCode: "",

      //modal boolean
      showModal: false,
      modalTitle: "",
      modalBtnText: "",
      showEditBtn: false,
      showCreateBtn: false,
      showAlert: false,
    };
  },
  created() {
    this.getCurrencies();
  },
  methods: {
    // ------ api calls -----------
    async getCurrencies() {
      await this.axios.get("/currency").then((result) => {
        this.currency = result.data;
        this.currencyLoaded = true;
        //when done fire next api call and get conversion rates
        this.getRates();
      });
    },

    async getRates() {
      await this.axios.get("/rates/").then((result) => {
        this.rates = result.data;
        this.ratesLoaded = true;
        this.getRatesForBase(this.getIdForCurrency(this.selected));
        if (this.storeISOCode != "") this.setInitialRates(this.storeISOCode);
        this.storeISOCode = "";
      });
    },

    async editRates(id, rate) {
      await this.axios.patch("rates/" + id, {
        rate: rate,
      });
    },

    async createCurrency(currency, ISOcode, country) {
      await this.axios
        .post("/currency/", {
          currency: currency,
          ISOcode: ISOcode,
          country: country,
        })
        .then(() => {
          this.getCurrencies();
        })
        .finally(() => {
          this.closeModal();
        });
    },
    async createInitialRates(id_base, id_second) {
      await this.axios
        .post("/rates/", {
          id_base: id_base,
          id_second: id_second,
          rate: 1,
        })
        .then(() => {
          this.getRates();
        });
    },

    // ------ helper methods -----------
    getIdForCurrency(code) {
      return this.currency
        .filter((item) => item.ISOcode == code)
        .map((curr) => curr.id);
    },

    getCurrencyForId(id) {
      return this.currency
        .filter((item) => item.id == id)
        .map((curr) => curr.ISOcode);
    },

    changeCurrency(event) {
      this.selected = event.target.value;
      this.getRatesForBase(this.getIdForCurrency(this.selected));
    },
    getRatesForBase(base) {
      // empty arrays first, because we use the push method
      this.keys = [];
      this.values = [];
      this.ratesBaseSelected = this.rates
        .filter((item) => item.id_base == base)
        .forEach((item) => {
          this.keys.push(this.getCurrencyForId(item.id_second)[0]);
          this.values.push({
            id: item.id,
            rate: item.rate,
            base: item.id_base,
            second: item.id_second,
          });
        });
    },
    setInitialRates(ISOcode) {
      var idx = this.getIdForCurrency(ISOcode).at(0);
      for (let id = 1; id <= idx; id++) {
        this.createInitialRates(id, idx);
      }
      for (let id = 1; id < idx; id++) {
        this.createInitialRates(idx, id);
      }
    },
    redirectTo(toPath) {
      this.$router.push({ path: toPath });
    },
    passContents(command) {
      this.showModal = true;
      switch (command) {
        case "edit":
          this.showEditBtn = true;
          this.modalTitle = "Wechselkurs ändern";
          break;
        case "create":
          this.showCreateBtn = true;
          this.modalTitle = "Neue Währung hinzufügen";
      }
    },
    performApiCall(command) {
      switch (command) {
        case "edit":
          this.values.forEach((item) => {
            this.editRates(item.id, item.rate);
            this.editRates(
              this.findIdforBaseSecond(item.base, item.second),
              Math.round((1 / item.rate) * 100) / 100
            );
          });

          this.closeModal();
          this.getRates();

          break;
        case "create":
          // perform data validation first
          if (this.valueName.trim() == "") {
            this.showAlert = true;
            this.alertMsg = "Die Währung muss eingegeben werden.";
            return;
          }
          if (this.valueISOCode.trim() == "") {
            this.showAlert = true;
            this.alertMsg = "Der ISO-Code muss eingegeben werden.";
            return;
          }
          if (this.valueCountry.trim() == "") {
            this.showAlert = true;
            this.alertMsg = "Das Land muss eingegeben werden.";
            return;
          }

          this.createCurrency(
            this.valueName,
            this.valueISOCode,
            this.valueCountry
          );
      }
    },
    closeModal() {
      this.showModal = false;
      this.showEditBtn = false;
      this.showCreateBtn = false;
      this.showAlert = false;
      this.alertMsg = "";

      this.valueName = "";
      this.storeISOCode = this.valueISOCode;
      this.valueISOCode = "";
      this.valueCountry = "";
    },
    clearAlert() {
      this.showAlert = false;
      this.alertMsg = "";
    },
    whenBase(selected, base) {
      return selected == base ? true : false;
    },
    findIdforBaseSecond(base, second) {
      return this.rates
        .filter((item) => item.id_base == second && item.id_second == base)
        .map((found) => found.id);
    },
  },
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
