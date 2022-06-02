import styled from 'styled-components';

// Styled components
export const Form = styled.form`
    flex-direction: column;
    margin: 40px auto 0 auto;
    padding: 60px 80px;
    width: 650px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0px 0px 43px 12px rgba(0,0,0,0.2);
   `;

export const InfoMessage = styled.small`
   margin: 10px 0 30px 0;
`;

export const Input = styled.input`
   width: 100%;
   height: 50px;
   font-size: 18px;

   &:focus {
      box-shadow: none !important;
   }
`;

export const Submit = styled.button`
   width: 100%;
   height: 50px;
   margin-top: 20px;
   font-weight: bold;
   box-shadow: 0px 15px 50px -15px #0D6EFD;
   
   &:focus {
      box-shadow: 0px 15px 50px -15px #0D6EFD;
   }
`;

export const ErrorLabel = styled.small`
   width: 100%;
   margin-top: 5px;
   margin-bottom: 20px;
   font-size: 12px;
   font-weight: bold;
   color: red;
`;

export const RedirectSpan = styled.span`
   font-weight: bold;
   cursor: pointer;
   color: #0D6EFD;
`;