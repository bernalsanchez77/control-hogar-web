import Category from './category/category';
import Categories from './categories/categories';
import './channels.css';

function Channels({devicesState, view, cableChannels, cableChannelCategories, changeControlParent, changeViewParent}) {

  const changeCategory = (category) => {
    const newView = structuredClone(view);
    newView.cable.channels.category = category;
    changeViewParent(newView);
  };

  const changeControl = (control) => {
    changeControlParent(control);
  };

  return (
    <div>
      {view.cable.channels.category.length === 0 &&
      <Categories
        devicesState={devicesState}
        cableChannels={cableChannels}
        cableChannelCategories={cableChannelCategories}
        changeControlParent={changeControl}
        changeCategoryParent={changeCategory}>
      </Categories>
      }
      {view.cable.channels.category.length &&
      <Category
        devicesState={devicesState}
        cableChannels={cableChannels}
        category={view.cable.channels.category}
        changeControlParent={changeControl}>
      </Category>
      }
    </div>
  );
}

export default Channels;
