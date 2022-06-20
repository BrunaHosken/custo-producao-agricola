<template><div>OI</div></template>

<!-- <v-row class="mt-4">
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formEtapa.tipoEtapa"
                      :items="itemsEtapa"
                      label="Tipo da Etapa"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formEtapa.tipoUso"
                      :items="itemsUso"
                      label="Tipo de Uso"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col cols="12" md="4" v-show="!isPrevisto">
                    <v-dialog
                      ref="dateDialogPrevista"
                      :return-value.sync="formEtapa.datePrevista"
                      v-model="showDateDialogPrevista"
                      persistent
                      width="290px"
                      fullwidth
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          name="datePrevista"
                          label="Data da Etapa"
                          prepend-inner-icon="mdi-calendar"
                          type="text"
                          readonly
                          :value="formattedDatePrevista"
                          v-on="on"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        locale="pt-br"
                        scrollable
                        color="primary"
                        v-model="dateDialogValuePrevista"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="cancelDateDialogPrevista">
                          Cancelar
                        </v-btn>
                        <v-btn
                          text
                          @click="
                            $refs.dateDialogPrevista.save(
                              dateDialogValuePrevista
                            )
                          "
                        >
                          Ok
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :error-messages="valueEtapaErrors"
                      :success="!$v.formEtapa.quantidade.$invalid"
                      v-model.trim="$v.formEtapa.quantidade.$model"
                      :label="label"
                      :value="formEtapa.quantidade"
                      prepend-inner-icon="mdi-numeric"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" v-show="isServico">
                    <v-select
                      v-model="formEtapa.servico"
                      :items="itemsServico"
                      label="Serviço"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    >
                      <v-list-item
                        slot="prepend-item"
                        ripple
                        @click="novoServico"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Novo Serviço</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4" v-show="!isServico">
                    <v-select
                      v-model="formEtapa.insumo"
                      :items="itemsInsumo"
                      label="Insumo"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      outlined
                    >
                      <v-list-item
                        slot="prepend-item"
                        ripple
                        @click="novoInsumo"
                      >
                        <v-list-item-action>
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-title>Novo Insumo</v-list-item-title>
                      </v-list-item>
                      <v-divider slot="prepend-item" class="mt-2"></v-divider
                    ></v-select>
                  </v-col>
                </v-row> -->
