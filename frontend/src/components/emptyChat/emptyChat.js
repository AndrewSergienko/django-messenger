import styled from 'styled-components';
import emptyChatImg from '../../assets/empty-chat.png';

export default function emptyChat() {
   return (
      <Wrap>
         <Image src={emptyChatImg} alt='Chat is empty' />
         <Text>This chat room is empty. Enter a notice in the field below to start a conversation.</Text>
      </Wrap>
   )
}

const Wrap = styled.section`
   width: 100%;
   height: 90vh;
   position: relative;
`

const Image = styled.img`
   position: absolute;
   top: 40%;
   left: 50%;
   transform: translate(-50%, -50%);
`

const Text = styled.p`
   width: 100%;
   position: absolute;
   top: 65%;
   
   font-size: 20px;
   font-weight: bold;
   text-align: center;
`