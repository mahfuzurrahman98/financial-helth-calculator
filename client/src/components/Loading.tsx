import PageLoad from '../assets/page_load.gif';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={PageLoad} alt="" />
    </div>
  );
};

export default Loading;
