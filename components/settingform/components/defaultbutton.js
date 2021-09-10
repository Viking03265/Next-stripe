
const DefaultButton = ({ name, link, onClick}) => (
    <a className="DefaultButton" href={link} onClick={onClick}>
        { name }
    </a>
);

export default DefaultButton