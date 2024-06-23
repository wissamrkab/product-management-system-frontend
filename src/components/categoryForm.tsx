import {useEffect, useState} from "react";
import {
    Category,
    transformCategoriesToSelectedTreeNodeValues,
    transformCategoriesToTreeNodes,
    TreeNodeCategory
} from "@/interfaces/category";
import {useAppContext} from "@/contexts/appContext";
import {CategoryService} from "@/services/categoriesService";
import {InputText} from "primereact/inputtext";
import {TreeSelect, TreeSelectSelectionKeysType} from "primereact/treeselect";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {Product} from "@/interfaces/product";
import {Dropdown} from "primereact/dropdown";

interface ProductFormProps {
    onFormSubmit: (nameAr: string, nameEn: string, parentId: string) => void;
    category: Category | undefined;
}

const ProductForm = ({ onFormSubmit, category }: ProductFormProps) => {
    const { showToast } = useAppContext();

    const [formData, setFormData] = useState({
        nameAr: category?.nameAr ?? '',
        nameEn : category?.nameEn ?? '',
        parentId : category?.parentId ?? undefined,
    });

    const [errors, setErrors] = useState({
        nameAr: '',
        nameEn: '',
        parentId: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Basic form validation
        let formValid = true;
        const { nameAr, nameEn, parentId } = formData;
        const newErrors = { nameAr: '', nameEn: '', parentId: ''};
        setErrors(newErrors);

        if (!nameAr) {
            newErrors.nameAr = 'NameAr is required';
            formValid = false;
        }

        if (!nameEn) {
            newErrors.nameEn = 'nameEn is required';
            formValid = false;
        }

        if (formValid) {
            onFormSubmit(nameAr!, nameEn!, parentId!)
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-column gap-2 mb-2">
                <label htmlFor="nameAr">Name ar</label>
                <InputText id="nameAr" name="nameAr" value={formData.nameAr} onChange={handleChange}/>
                <small id="nameAr-help">
                    Enter the product name ar.
                </small>
                <span style={{color: 'red'}}>{errors.nameAr}</span>
            </div>
            <div className="flex flex-column gap-2 mb-2">
                <label htmlFor="nameEn">Name en</label>
                <InputText id="nameEn" name="nameEn" value={formData.nameEn} onChange={handleChange}/>
                <small id="nameEn-help">
                    Enter the product name en.
                </small>
                <span style={{color: 'red'}}>{errors.nameEn}</span>
            </div>
            <Button type="submit">Save</Button>
        </form>
    )
}

export default ProductForm;