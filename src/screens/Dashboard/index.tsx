import React from "react";
import { HighlightCard } from "../../components/HighlightCard";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlithCards
} from './styles';

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo 
              source={{ uri: 'https://avatars.githubusercontent.com/u/57159704?v=4'}} 
            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Régis</UserName>
            </User>
          </UserInfo>
          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlithCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down" 
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última entrada dia 03 de abril"
        />
        <HighlightCard
          type="total" 
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 á 16 de abril"
        />
      </HighlithCards>
    </Container>
  )
}       
