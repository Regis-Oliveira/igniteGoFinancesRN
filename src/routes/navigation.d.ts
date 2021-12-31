export type GoFinancesRoutesList = {
  Listagem: undefined;
  Cadastrar: undefined;
  Resumo: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends GoFinancesRoutesList {}
  }
}