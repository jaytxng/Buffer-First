import React from "react";
import styled from 'styled-components';

interface HelloProps { compiler: string; framework: string; }

const Heading = styled.h1`
  color: blue;
`
const Hello = (props: HelloProps) => <Heading>Hello from {props.compiler} and {props.framework}.</Heading>;

Hello.displayName = 'Hello';

export default Hello;

// below lines are for CSS Modules equivalent
// import styles from './Hello.module.css';
// const Hello = (props: HelloProps) => <h1 className={`${styles.test}`}>Hello from {props.compiler} and {props.framework}!</h1>;