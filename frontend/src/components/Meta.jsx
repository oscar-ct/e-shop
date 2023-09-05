import {Helmet} from "react-helmet-async";

const Meta = ({title}) => {
    return (
        <Helmet>
            <title>e-shop | {title}</title>
            {/*<meta name={"description"} content={description}/>*/}
            {/*<meta name={"keywords"} content={keywords}/>*/}
        </Helmet>
    );
};

Meta.defaultProps = {
    title: "e-shop",
}

export default Meta;