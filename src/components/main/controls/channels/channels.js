import { store } from "../../../../store/store";
import Category from './category/category';
import Categories from './categories/categories';
import ViewRouter from '../../../../global/view-router';
import './channels.css';
const viewRouter = new ViewRouter();

function Channels({ cableChannelCategories, changeControlParent }) {
  const viewSt = store(v => v.viewSt);
  const changeCategory = async (category) => {
    const newView = structuredClone(viewSt);
    newView.cable.channels.category = category;
    await viewRouter.changeView(newView);
  };

  const changeControl = (control) => {
    changeControlParent(control);
  };

  return (
    <div>
      {viewSt.cable.channels.category.length === 0 &&
        <Categories
          cableChannelCategories={cableChannelCategories}
          changeControlParent={changeControl}
          changeCategoryParent={changeCategory}>
        </Categories>
      }
      {viewSt.cable.channels.category.length &&
        <Category
          category={viewSt.cable.channels.category}
          changeControlParent={changeControl}>
        </Category>
      }
    </div>
  );
}

export default Channels;
