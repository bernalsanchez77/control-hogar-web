import { store } from "../../../../store/store";
import Category from './category/category';
import Categories from './categories/categories';
import viewRouter from '../../../../global/view-router';
import './channels.css';

function Channels() {
  const viewSt = store(v => v.viewSt);
  const changeCategory = async (category) => {
    const newView = structuredClone(viewSt);
    newView.cable.channels.category = category;
    await viewRouter.changeView(newView);
  };

  return (
    <div>
      {viewSt.cable.channels.category.length === 0 &&
        <Categories
          changeCategoryParent={changeCategory}>
        </Categories>
      }
      {viewSt.cable.channels.category.length &&
        <Category
          category={viewSt.cable.channels.category}>
        </Category>
      }
    </div>
  );
}

export default Channels;
