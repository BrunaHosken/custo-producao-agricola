import apollo from "../../../../../plugins/apollo";
import culturaDesenvolvidaQuery from "./../../custo-producao/graphql/CulturaDesenvolvida.gql";
import culturaEtapaQuery from "./../../custo-producao/graphql/CulturaEtapa.gql";
import usoInsumoPrevistoQuery from "./../../custo-producao/graphql/UsoInsumoPrevisto.gql";
import usoInsumoRealQuery from "./../../custo-producao/graphql/UsoInsumoReal.gql";
import servicoPrevistoQuery from "./../../custo-producao/graphql/ServicoPrevisto.gql";
import servicoPrestadoQuery from "./../../custo-producao/graphql/ServicoPrestado.gql";

import VendasQuery from "./../../vendas/graphql/vendas.gql";

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

const culturaDesenvolvidaWithVendas = async (variables) => {
  const response = await apollo.mutate({
    mutation: VendasQuery,
    variables,
  });
  response.data.vendaItems.map((data) => {
    data.total = data.Qtd * data.PrecoUnit;
  });
  response.data.vendaItems.forEach(async (vendaItem) => {
    vendaItem.totalProduzidas = 0;
    vendaItem.custoUnitario = 0;
    variables = {};
    variables.id = vendaItem.CulturaDesenvolvida.id;

    vendaItem.culturaProducaoEtapas = await apollo.mutate({
      mutation: culturaDesenvolvidaQuery,
      variables,
    });

    vendaItem.culturaProducaoEtapas.data.culturaDesenvolvidas.forEach(
      async (data) => {
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
              etapa.total +=
                response.DiasHomem * response.Servico.ValorDiaHomem;
            });
            etapa.servicoPrestado.forEach((response) => {
              etapa.total +=
                response.DiasHomem * response.Servico.ValorDiaHomem;
            });
            data.total += etapa.total;

            vendaItem.custoUnitario = data.total / data.QtdColhida;
          });
        }
        vendaItem.totalProduzidas += data.QtdColhida;
      }
    );
  });
  return response.data.vendaItems;
};

export default {
  culturaDesenvolvidaWithVendas,
};
