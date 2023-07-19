export const formatPrice = (price, fontSize) => {
    if (price.toString().indexOf(".")) {
        return (
            <div className={"flex"}>
                <span className={"text-xs pt-1"}>$</span>
                <span className={`${fontSize} font-bold`}>{price.toString().substring(0,  price.toString().indexOf("."))}</span>
                <span className={"text-xs pt-1"}>{price.toString().substring(price.toString().indexOf(".")+1, price.toString().length).substring(0, 2)}</span>
            </div>
        )
    } else {
        return (
            <div className={"flex"}>
                <span className={"text-xs pt-1"}>$</span>
                <span className={`${fontSize} font-bold`}>{price}</span>
            </div>
        )
    }

}