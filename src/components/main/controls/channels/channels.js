import Category from './category/category';
import Categories from './categories/categories';
import './channels.css';

function Channels({devicesState, view, cableChannels, cableChannelCategories, changeControlParent, changeViewParent}) {

  const changeCategory = (category) => {
    const newView = {...view};
    newView.channels.category = category;
    changeViewParent(newView);
  };

  const changeControl = (control) => {
    changeControlParent(control);
  };

  return (
    <div>
      {view.channels.category.length === 0 &&
      <Categories
        devicesState={devicesState}
        cableChannels={cableChannels}
        cableChannelCategories={cableChannelCategories}
        changeControlParent={changeControl}
        changeCategoryParent={changeCategory}>
      </Categories>
      }
      {view.channels.category.length &&
      <Category
        devicesState={devicesState}
        cableChannels={cableChannels}
        category={view.channels.category}
        changeControlParent={changeControl}>
      </Category>
      }
    </div>
  );
}

export default Channels;
