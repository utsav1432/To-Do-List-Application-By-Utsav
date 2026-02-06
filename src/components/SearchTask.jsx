import React from "react";

const SearchTask = ({ search, setSearch, getTasks, searchTasks }) => {
  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchTasks();
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    getTasks();
  };

  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-100">
        Search Tasks:
      </h3>
      <div className="flex gap-2">
        <div className="relative flex-1">

          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearchKey} placeholder="Search tasks..." className="w-full bg-white text-black border border-gray-300 rounded-lg px-3 py-2 md:py-3 outline-none" />

          {search && (
            <button onClick={handleClearSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" type="button" title="Clear search">
              ✕
            </button>
          )}
        </div>
        <button onClick={searchTasks} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchTask;
