import apollo from "../../../../../plugins/apollo";
import VendasQuery from "./../graphql/vendas.gql";
import CreateVenda from "./../graphql/createVendas.gql";
import CreateVendaItem from "./../graphql/createVendasItens.gql";
import DeleteVendaItem from "./../graphql/deleteVendasItens.gql";
import UpdateVenda from "./../graphql/updateVenda.gql";
import UpdateVendaItem from "./../graphql/updateVendasItens.gql";

const vendas = async (variables) => {
  const response = await apollo.mutate({
    mutation: VendasQuery,
    variables,
  });
  response.data.vendaItems.map((data) => {
    data.total = data.Qtd * data.PrecoUnit;
  });
  return response.data.vendaItems;
};

const createVendas = async (variables) => {
  variables.quantidade = Number(variables.quantidade);
  variables.valor = Number(variables.valor);
  variables.culturaId = variables.culturaDescricao.id;
  variables.clienteId = variables.cliente.id;
  const responseVenda = await apollo.mutate({
    mutation: CreateVenda,
    variables,
  });
  variables.vendaId = responseVenda.data.createVenda.id;
  const response = await apollo.mutate({
    mutation: CreateVendaItem,
    variables,
  });
  return response.data.createVendaItem;
};

const deleteVendaItem = async (variables) => {
  variables.forEach(async (variables) => {
    const response = await apollo.mutate({
      mutation: DeleteVendaItem,
      variables,
    });
    return response.data.deleteVendaItem;
  });
};

const updateVendaItem = async (variables) => {
  variables.quantidade = Number(variables.quantidade);
  variables.valor = Number(variables.valor);
  variables.culturaId = variables.culturaDescricao.id;
  variables.clienteId = variables.cliente.id;
  const responseVenda = await apollo.mutate({
    mutation: UpdateVenda,
    variables,
  });
  const response = await apollo.mutate({
    mutation: UpdateVendaItem,
    variables,
  });
  return response.data.updateVendaItem;
};

export default {
  vendas,
  createVendas,
  deleteVendaItem,
  updateVendaItem,
};
