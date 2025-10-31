import { Route, Routes } from "react-router-dom";
import CategoryList from "./Category/CategoryList";
import AddEditCategoryTab from "./Category/AddEditCategoryTab";

function CategoryTab({ shop }) {
  return (
    <Routes>
      <Route path="/" element={<CategoryList shop={shop} />} />
      <Route path="add" element={<AddEditCategoryTab shop={shop} />} />
      <Route path="edit/:id" element={<AddEditCategoryTab shop={shop} />} />
    </Routes>
  );
}

export default CategoryTab;
