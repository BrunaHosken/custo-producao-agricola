import apollo from "../../../../../plugins/apollo";

import createInsumoPrevisto from "./../graphql/insumos/createInsumoPrevisto.gql";
import createInsumoReal from "./../graphql/insumos/createInsumoReal.gql";
import deleteInsumoPrevisto from "./../graphql/insumos/deleteInsumoPrevisto.gql";
import deleteInsumoReal from "./../graphql/insumos/deleteInsumoReal.gql";
import updateInsumoPrevisto from "./../graphql/insumos/updateInsumoPrevisto.gql";
import updateInsumoReal from "./../graphql/insumos/updateInsumoReal.gql";

import createServicoPrestado from "./../graphql/servicos/createServicoPrestado.gql";
import createServicoPrevisto from "./../graphql/servicos/createServicoPrevisto.gql";
import deleteServicoPrevisto from "./../graphql/servicos/deleteServicoPrevisto.gql";
import deleteServicoPrestado from "./../graphql/servicos/deleteServicoPrestado.gql";
import updateServicoPrevisto from "./../graphql/servicos/updateServicoPrevisto.gql";
import updateServicoPrestado from "./../graphql/servicos/updateServicoPrestado.gql";

import moment from "moment";

const CreateInsumoPrevisto = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.insumoId = variables.insumo.id;
  const response = await apollo.mutate({
    mutation: createInsumoPrevisto,
    variables,
  });
  return response.data.createInsumoPrevisto;
};
const CreateInsumoReal = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  console.log(variables.insumo);
  variables.insumoId = variables.insumo.id;
  console.log(variables);
  const response = await apollo.mutate({
    mutation: createInsumoReal,
    variables,
  });
  console.log(response);
  return response.data.createInsumoReal;
};
const CreateServicoPrevisto = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.servicoId = variables.servico.id;
  const response = await apollo.mutate({
    mutation: createServicoPrevisto,
    variables,
  });
  return response.data.createServicoPrevisto;
};
const CreateServicoPrestado = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.servicoId = variables.servico.id;
  const response = await apollo.mutate({
    mutation: createServicoPrestado,
    variables,
  });
  return response.data.createServicoPrestado;
};
const UpdateInsumoPrevisto = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.insumoId = variables.insumo.id;
  const response = await apollo.mutate({
    mutation: updateInsumoPrevisto,
    variables,
  });
  return response.data.updateInsumoPrevisto;
};
const UpdateInsumoReal = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.insumoId = variables.insumo.id;
  const response = await apollo.mutate({
    mutation: updateInsumoReal,
    variables,
  });
  return response.data.updateInsumoReal;
};
const UpdateServicoPrevisto = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.servicoId = variables.servico.id;
  const response = await apollo.mutate({
    mutation: updateServicoPrevisto,
    variables,
  });
  return response.data.updateServicoPrevisto;
};
const UpdateServicoPrestado = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.servicoId = variables.servico.id;
  const response = await apollo.mutate({
    mutation: updateServicoPrestado,
    variables,
  });
  return response.data.updateServicoPrestado;
};

const DeleteServicoPrevisto = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteServicoPrevisto,
    variables,
  });
  return response.data.deleteServicoPrevisto;
};
const DeleteServicoPrestado = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteServicoPrestado,
    variables,
  });
  return response.data.deleteServicoPrestado;
};
const DeleteInsumoReal = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteInsumoReal,
    variables,
  });
  return response.data.deleteInsumoReal;
};
const DeleteInsumoPrevisto = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteInsumoPrevisto,
    variables,
  });
  return response.data.deleteInsumoPrevisto;
};

export default {
  DeleteServicoPrevisto,
  DeleteServicoPrestado,
  DeleteInsumoReal,
  DeleteInsumoPrevisto,
  CreateServicoPrestado,
  CreateServicoPrevisto,
  CreateInsumoReal,
  CreateInsumoPrevisto,
  UpdateServicoPrestado,
  UpdateInsumoPrevisto,
  UpdateServicoPrevisto,
  UpdateInsumoReal,
};
