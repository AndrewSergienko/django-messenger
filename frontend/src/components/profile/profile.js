import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

import defaultAvatar from '../../assets/default-avatar.png';

export default class Profile extends Component {
   render() {
      const {isOpen, info, closeModal} = this.props;

      isOpen ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';

      return (
         <StyledModal 
            isOpen={isOpen}
            onRequestClose={closeModal}>
            <Title>User info</Title>
            <Upper>
               <Avatar src={info.avatar === null ? defaultAvatar : ''} alt='Avatar' />
               <Info>
                  <FullName>{info.first_name} {info.last_name}</FullName>
                  <Status>{info.active_status}</Status>
               </Info>
            </Upper>
            <Bottom>
               {info.phone ? <Label>Phone: <Link href={`tel:${info.phone}`}>{info.phone}</Link></Label> : ''}
               <Label>Email: <Link href={`mailto:${info.email}`}>{info.email}</Link></Label>
               <Label>Username: <Link>@{info.username}</Link></Label>
            </Bottom>
         </StyledModal>
      )
   }
}


// Styled components
const StyledModal = styled(Modal)`
   width: 500px;
   height: 400px;

   padding: 20px;

   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);

   background: #fff;
   box-shadow: 0px 0px 15px 1px #000;
   border-radius: 10px;

   &:focus {
      outline: none;
   }
`;

const Title = styled.h2`
   margin-bottom: 20px;
   font-size: 26px;
   font-weight: bold;
`

const Upper = styled.section`
   display: flex;
   align-items: center;
   margin-bottom: 40px;
`

const Avatar = styled.img`
   margin-right: 20px;
   width: 64px;
   height: 64px;
   border-radius: 100px;
`

const Info = styled.section`
   display: flex;
   flex-direction: column;
`

const FullName = styled.p`
   margin: 0;
   font-size: 18px;
   font-weight: bold;
`

const Status = styled.span`
   font-size: 14px;
`

const Bottom = styled.section`
   display: flex;
   flex-direction: column;
`

const Label = styled.span`
   margin-bottom: 10px;
`

const Link = styled.a`
   color: #000;
   text-decoration: none;
   cursor: pointer;
   
   &:hover {
      color: #000;
      text-decoration: underline;
   }
`