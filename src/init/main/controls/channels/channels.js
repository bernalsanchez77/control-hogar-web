import { useChannelsControls } from './useChannelsControls';
import Category from './category/category';
import Categories from './categories/categories';
import './channels.css';

function Channels() {
  const { viewSt } = useChannelsControls();

  return (
    <div>
      {viewSt.cable.channels.category.length === 0 &&
        <Categories></Categories>
      }
      {viewSt.cable.channels.category.length > 0 &&
        <Category></Category>
      }
    </div>
  );
}

export default Channels;
