import React, { Component } from "react";
import styled from "styled-components";
import Modal from "react-modal";

import defaultAvatar from "../../assets/default-avatar.png";
import editBtn from "../../assets/edit.png";

export default class Profile extends Component {
	state = {
		changeMode: false,
		first_name: "",
		last_name: "",
	};

	switchMode = () => {
		this.setState({ changeMode: !this.state.changeMode });
	};

	changeInput = event => {
		const target = event.target;

		if (target.id === "first-name-input") {
			this.setState({
				first_name: target.value,
			});
		} else if (target.id === "last-name-input") {
			this.setState({
				last_name: target.value,
			});
		}
	};

	submitForm = async event => {
		event.preventDefault();
		const { first_name, last_name } = this.state;
		const { changeUserInfo } = this.props;

		await changeUserInfo(first_name, last_name);
		this.setState({
			changeMode: !this.state.changeMode,
			first_name: "",
			last_name: "",
		});
	};

	changeAvatar = async event => {
		const data = new FormData();
		data.append("file", event.target.files[0]);
		fetch("http://127.0.0.1:8000/api/files/upload", {
			method: "POST",
			headers: {
				authorization: `Token ${this.props.authToken}`,
			},
			body: data,
		})
			.then(response => response.json())
			.then(file => {
				const data = new FormData();
				data.append("file_id", file.id);
				fetch("http://127.0.0.1:8000/api/users/me/set_avatar", {
					method: "POST",
					headers: {
						authorization: `Token ${this.props.authToken}`,
					},
					body: data,
				});
			});
	};

	render() {
		const { userId, isOpen, info, closeModal } = this.props;
		isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "unset");

		return (
			<StyledModal
				isOpen={isOpen}
				onRequestClose={() => {
					closeModal();
					this.setState({ changeMode: false });
				}}>
				<Title>User info</Title>
				<Upper>
					{!this.state.changeMode ? (
						<>
							<Avatar src={info.avatar ? info.avatar.file : defaultAvatar} alt="Avatar" />
							<Info>
								<FullName>
									{info.first_name} {info.last_name}
									{userId === info.id ? <Edit src={editBtn} alt="Edit" onClick={this.switchMode} /> : ""}
								</FullName>
								<Status>{info.active_status ? info.active_status : "online"}</Status>
							</Info>
						</>
					) : (
						<>
							<ImgLabel htmlFor="file-input">
								<Avatar src={info.avatar ? info.avatar.file : defaultAvatar} alt="Avatar" />
								<small>Click to change</small>
								<FileInput id="file-input" type="file" accept=".png, .jpg, .jpeg" onChange={event => this.changeAvatar(event)} />
							</ImgLabel>
							<Info>
								<ChangeMode onSubmit={event => this.submitForm(event)}>
									<Input
										id="first-name-input"
										className="form-control"
										type="text"
										placeholder="First name"
										value={this.state.first_name}
										onChange={this.changeInput}
										required
									/>
									<Input
										id="last-name-input"
										className="form-control"
										type="text"
										placeholder="Second name"
										value={this.state.last_name}
										onChange={this.changeInput}
									/>
									<Submit className="btn btn-primary" type="submit">
										Save
									</Submit>
									<Close onClick={this.switchMode}>x</Close>
								</ChangeMode>
								<Status>{info.active_status ? info.active_status : "online"}</Status>
							</Info>
						</>
					)}
				</Upper>
				<Bottom>
					{info.phone ? (
						<Label>
							Phone: <Link href={`tel:${info.phone}`}>{info.phone}</Link>
						</Label>
					) : (
						""
					)}
					<Label>
						Email: <Link href={`mailto:${info.email}`}>{info.email}</Link>
					</Label>
					<Label>
						Username: <Link>@{info.username}</Link>
					</Label>
				</Bottom>
			</StyledModal>
		);
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
`;

const Upper = styled.section`
	display: flex;
	align-items: center;
	margin-bottom: 40px;
`;

const Avatar = styled.img`
	margin-right: 20px;
	width: 64px;
	height: 64px;
	border-radius: 100px;
`;

const Info = styled.section`
	display: flex;
	flex-direction: column;
`;

const FullName = styled.p`
	margin: 0;
	font-size: 18px;
	font-weight: bold;
`;

const Status = styled.span`
	font-size: 14px;
`;

const Bottom = styled.section`
	display: flex;
	flex-direction: column;
`;

const Label = styled.span`
	margin-bottom: 10px;
`;

const Link = styled.a`
	color: #000;
	text-decoration: none;
	cursor: pointer;

	&:hover {
		color: #000;
		text-decoration: underline;
	}
`;

const Edit = styled.img`
	margin-bottom: 5px;
	margin-left: 5px;
	cursor: pointer;
`;

const ChangeMode = styled.form`
	display: flex;
	margin-bottom: 5px;
`;

const Input = styled.input`
	margin-right: 5px;
	width: 35%;
	height: 30px;
	font-size: 14px;

	&:focus {
		box-shadow: none !important;
	}
`;

const Submit = styled.button`
	height: 30px;
	font-size: 14px;
	box-shadow: 0px 15px 50px -15px #0d6efd;

	&:focus {
		box-shadow: 0px 15px 50px -15px #0d6efd;
	}
`;

const Close = styled.button`
	margin-left: 5px;
	background: none;
	border: none;
`;

const FileInput = styled.input`
	display: none;
`;

const ImgLabel = styled.label`
	width: 64px;
	margin-right: 20px;
	border-radius: 100px;
`;
