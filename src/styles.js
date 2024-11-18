import styled from "styled-components";

export const DetailsWrapper = styled.div`
  display: flex;
  gap: 30px;
`;

export const ActionsContainer = styled.div`
display: flex
gap: 10px;
margin-left: 10px;
justify-content: flex-end;`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  align-items: center;

  #list {
    width: 600px;
  }

  @media (max-width: 768px) {
    #list {
      width: 250px;
    }
    padding: 2px;
  }
`;
