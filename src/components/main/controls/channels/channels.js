import Category from './category/category';
import Categories from './categories/categories';
import './channels.css';
import { store } from '../../../../store/store';
function Channels() {
  const viewSt = store(v => v.viewSt);

  return (
    <div>
      {viewSt.cable.channels.category.length === 0 &&
        <Categories></Categories>
      }
      {viewSt.cable.channels.category.length &&
        <Category></Category>
      }
    </div>
  );
}

export default Channels;
