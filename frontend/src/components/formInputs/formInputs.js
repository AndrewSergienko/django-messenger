import styled from 'styled-components';

// Styled components
export const Form = styled.form`
      flex-direction: column;
      margin: 50px auto 0 auto;
      padding-top: 40px;

      width: 450px;
      height: ${props => props.height}px;

      border-radius: 5px;
      background: #fff;

      box-shadow: 0px 0px 23px 0px rgba(0, 0, 0, 0.58);
   `;

export const InfoMessage = styled.small`
   margin: 20px 0 30px 0;
`;

export const Input = styled.input`
   width: 300px;
   margin-bottom: 20px;
`;

export const Submit = styled.button`
   width: 150px;
   margin-top: 40px;
`;

export const Label = styled.small`
   width: 300px;
   margin-top: 20px;

   font-size: 12px;
   text-align: center;
   font-weight: bold;
   color: ${props => props.color};
`;

export const RedirectSpan = styled.span`
   font-weight: bold;
   cursor: pointer;
`;