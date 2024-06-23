import {useEffect, useState} from "react";
import {
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

interface ProductFormProps {
    onFormSubmit: (name: string, isbn: string, price: number, categories: TreeSelectSelectionKeysType) => void;
    product: Product | undefined;
}

const ProductForm = ({ onFormSubmit, product }: ProductFormProps) => {
    const categoryService = new CategoryService();
    const [categories, setCategories] = useState<TreeNodeCategory[]>();
    const { showToast } = useAppContext();

    useEffect(() => {
        const fetchCategoriesData = async () => {
            const categoriesData = await categoryService.fetchCategories();

            if(categoriesData != undefined) {
                setCategories(prevState => transformCategoriesToTreeNodes(categoriesData));
            }
            else{
                showToast("error", "Categories Could Not Be Fetched");
            }
        };

        fetchCategoriesData();
    }, []);

    const [formData, setFormData] = useState({
        name: product?.name ?? '',
        isbn : product?.isbn ?? '',
        price : product?.price ?? 0,
        categories: transformCategoriesToSelectedTreeNodeValues(product?.categories ?? []) ?? []
    });

    const [errors, setErrors] = useState({
        name: '',
        isbn: '',
        price: '',
        categories: ''
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
        const { name, isbn, price, categories } = formData;
        const newErrors = { name: '', isbn: '', price: '', categories: '' };
        setErrors(newErrors);

        if (!name) {
            newErrors.name = 'Name is required';
            formValid = false;
        }

        if (!isbn) {
            newErrors.isbn = 'ISBN is required';
            formValid = false;
        } else if (!validateISBN(isbn)) {
            newErrors.isbn = 'ISBN format is not correct';
            formValid = false;
        }

        if (price <= 0) {
            newErrors.price = 'Price must be greater than 0';
            formValid = false;
        }

        if (Object.keys(categories).length == 0) {
            newErrors.categories = 'Please select one category at least.';
            formValid = false;
        }

        if (formValid) {
            onFormSubmit(name!, isbn!, price, categories)
        } else {
            setErrors(newErrors);
        }
    };

    const validateISBN = (isbn: string) => {
        // Remove hyphens and spaces from the ISBN
        isbn = isbn.replace(/[^\dX]/gi, '');

        // Validate ISBN-10 or ISBN-13 format
        if (isbn.length === 10) {
            // Validate ISBN-10
            const regex = /^(?:\d{9}X|\d{10})$/;
            return regex.test(isbn);
        } else if (isbn.length === 13) {
            // Validate ISBN-13
            const regex = /^(?:978|979)\d{10}$/;
            return regex.test(isbn);
        } else {
            return false;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-column gap-2 mb-2">
                <label htmlFor="name">Name</label>
                <InputText id="name" name="name" value={formData.name} onChange={handleChange}/>
                <small id="name-help">
                    Enter the product name.
                </small>
                <span style={{color: 'red'}}>{errors.name}</span>
            </div>
            <div className="flex flex-column gap-2 mb-2">
                <label htmlFor="categories">Categories</label>
                <TreeSelect id="categories" name="categories" value={formData.categories ?? undefined}
                            onChange={handleChange} options={categories} selectionMode={"multiple"}
                />
                <small id="name-help">
                    Select the product categories.
                </small>
                <span style={{color: 'red'}}>{errors.categories}</span>
            </div>
            <div className="flex flex-column gap-2 mb-2">
                <label htmlFor="isbn">ISBN</label>
                <InputText id="isbn" name="isbn" value={formData.isbn} onChange={handleChange}/>
                <small id="isbn-help">
                    Enter the product ISBN.
                </small>
                <span style={{color: 'red'}}>{errors.isbn}</span>
            </div>
            <div className="flex flex-column gap-2 mb-2">
                <label htmlFor="price">Price</label>
                <InputNumber inputId="price" name="price" value={formData.price}
                             onChange={e => handleChange(e.originalEvent)}/>
                <small id="price-help">
                    Enter the product price.
                </small>
                <span style={{color: 'red'}}>{errors.price}</span>
            </div>
            <Button type="submit">Save</Button>
        </form>
    )
}

export default ProductForm;