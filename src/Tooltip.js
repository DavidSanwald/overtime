import styled from "styled-components";

const Tooltip = styled("div")`
  padding: 16px;
  display: flex;
  flex-direction: column;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  position: absolute;
  background-color: white;
  color: rgba(25, 29, 34, 0.54);
  padding: 12;
  font-size: 14;
  box-shadow: 0 4px 8px 0 rgba(25, 29, 34, 0.1);
  pointer-events: none;
  border-radius: 3;
  border: 1px solid rgba(25, 29, 34, 0.12);
`;

export default Tooltip;
