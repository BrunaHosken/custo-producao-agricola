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
  variables.insumoId = variables.insumo.id;

  const response = await apollo.mutate({
    mutation: createInsumoReal,
    variables,
  });
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

const culturaDesenvolvidaWithEtapas = async (variables) => {
  const culturaDesenvolvida = await apollo.mutate({
    mutation: culturaDesenvolvidaQuery,
    variables,
  });

  culturaDesenvolvida.data.culturaDesenvolvidas.forEach(async (data) => {
    const variablesEtapas = {};
    variablesEtapas.id = data.id;
    data.total = 0;
    data.custoUnitario = 0;
    data.etapas = await culturaEtapa(variablesEtapas);
    if (data.etapas.length > 0) {
      data.etapas.forEach(async (etapa) => {
        etapa.total = 0;

        const variablesTipoEtapa = {};
        variablesTipoEtapa.id = etapa.id;
        etapa.insumoPrevisto = await usoInsumoPrevisto(variablesTipoEtapa);
        etapa.insumoReal = await usoInsumoReal(variablesTipoEtapa);
        etapa.servicoPrevisto = await servicoPrevisto(variablesTipoEtapa);
        etapa.servicoPrestado = await servicoPrestado(variablesTipoEtapa);

        etapa.insumoPrevisto.forEach((response) => {
          etapa.total += response.Qtd * response.Insumo.PrecoUnit;
        });
        etapa.insumoReal.forEach((response) => {
          etapa.total += response.Qtd * response.Insumo.PrecoUnit;
        });
        etapa.servicoPrevisto.forEach((response) => {
          etapa.total += response.DiasHomem * response.Servico.ValorDiaHomem;
        });
        etapa.servicoPrestado.forEach((response) => {
          etapa.total += response.DiasHomem * response.Servico.ValorDiaHomem;
        });
        data.total += etapa.total;
      });
    }
  });

  return culturaDesenvolvida.data.culturaDesenvolvidas;
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
  culturaDesenvolvidaWithEtapas,
};
