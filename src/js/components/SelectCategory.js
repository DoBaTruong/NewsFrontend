import { Fragment } from "react"
import { decodeHtml } from "../helpers/helpers"

const SelectCategory = ({categories}) => {
    
    return (
        <Fragment>
            {
                categories.childrens && categories.childrens.map((item, index) => (
                    <Fragment key={index}>
                        <option value={item.category.id}>{item.text + ' ' + decodeHtml(item.category.name)}</option>
                        <SelectCategory categories={item} />
                    </Fragment>
                ))
            }
        </Fragment>
    )
}

export default SelectCategory