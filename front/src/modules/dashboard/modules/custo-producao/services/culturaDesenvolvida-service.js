import apollo from "../../../../../plugins/apollo";
import culturaDesenvolvidaQuery from "./../graphql/CulturaDesenvolvida.gql";
import culturaEtapaQuery from "./../graphql/CulturaEtapa.gql";
import createCulturaDesenvolvida from "./../graphql/createCulturaDesenvolvida.gql";
import deleteCulturaDesenvolvida from "./../graphql/deleteCulturaDesenvolvida.gql";
import usoInsumoPrevistoQuery from "./../graphql/UsoInsumoPrevisto.gql";
import usoInsumoRealQuery from "./../graphql/UsoInsumoReal.gql";
import servicoPrevistoQuery from "./../graphql/ServicoPrevisto.gql";
import servicoPrestadoQuery from "./../graphql/ServicoPrestado.gql";
import updateCulturaDesenvolvida from "./../graphql/updateCulturaDesenvolvida.gql";
import updateCulturaEtapa from "./../graphql/updateCulturaEtapa.gql";
import createCulturaEtapa from "./../graphql/createCulturaEtapa.gql";
import deleteCulturaEtapa from "./../graphql/deleteCulturaEtapa.gql";
import moment from "moment";

const culturaDesenvolvida = async (variables) => {
  const response = await apollo.mutate({
    mutation: culturaDesenvolvidaQuery,
    variables,
  });
  return response.data.culturaDesenvolvidas;
};
const culturaEtapa = async (variables) => {
  const response = await apollo.mutate({
    mutation: culturaEtapaQuery,
    variables,
  });
  return response.data.culturaEtapas;
};
const usoInsumoPrevisto = async (variables) => {
  const response = await apollo.mutate({
    mutation: usoInsumoPrevistoQuery,
    variables,
  });
  return response.data.usoInsumoPrevistoes;
};
const usoInsumoReal = async (variables) => {
  const response = await apollo.mutate({
    mutation: usoInsumoRealQuery,
    variables,
  });
  return response.data.usoInsumoReals;
};
const servicoPrevisto = async (variables) => {
  const response = await apollo.mutate({
    mutation: servicoPrevistoQuery,
    variables,
  });
  return response.data.servicoPrevistoes;
};
const servicoPrestado = async (variables) => {
  const response = await apollo.mutate({
    mutation: servicoPrestadoQuery,
    variables,
  });
  return response.data.servicoPrestadoes;
};

const CreateCulturaDesenvolvida = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.terreno = parseFloat(variables.terreno);
  variables.culturaDescricaoId = variables.culturaDescricao.id;

  const response = await apollo.mutate({
    mutation: createCulturaDesenvolvida,
    variables,
  });
  return response.data.createCulturaDesenvolvida;
};
const UpdateCulturaDesenvolvida = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.terreno = parseFloat(variables.terreno);
  variables.culturaDescricaoId = variables.culturaDescricao.id;

  const response = await apollo.mutate({
    mutation: updateCulturaDesenvolvida,
    variables,
  });
  return response.data.updateCulturaDesenvolvida;
};

const DeleteCulturaDesenvolvida = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteCulturaDesenvolvida,
    variables,
  });
  return response.data.deleteCulturaDesenvolvida;
};

const CreateCulturaEtapa = async (variables) => {
  variables.mesFinal = moment(variables.mesFinal).format("YYYY-MM-DD");
  variables.mesInicio = moment(variables.mesInicio).format("YYYY-MM-DD");
  variables.ordem = Number(variables.ordem);
  const response = await apollo.mutate({
    mutation: createCulturaEtapa,
    variables,
  });
  return response.data.createCulturaEtapa;
};

const UpdateCulturaEtapa = async (variables) => {
  variables.mesFinal = moment(variables.mesFinal).format("YYYY-MM-DD");
  variables.mesInicio = moment(variables.mesInicio).format("YYYY-MM-DD");
  variables.ordem = Number(variables.ordem);
  const response = await apollo.mutate({
    mutation: updateCulturaEtapa,
    variables,
  });
  return response.data.updateCulturaEtapa;
};

const DeleteCulturaEtapa = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteCulturaEtapa,
    variables,
  });
  return response.data.deleteCulturaEtapa;
};

export default {
  culturaDesenvolvida,
  culturaEtapa,
  CreateCulturaDesenvolvida,
  DeleteCulturaDesenvolvida,
  servicoPrestado,
  servicoPrevisto,
  usoInsumoPrevisto,
  usoInsumoReal,
  UpdateCulturaDesenvolvida,
  UpdateCulturaEtapa,
  CreateCulturaEtapa,
  DeleteCulturaEtapa,
};
