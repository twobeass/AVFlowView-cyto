import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/graphStore';

export const FilterPanel: React.FC = () => {
  const { graph, filterCategories, setFilterCategories } = useGraphStore();
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!graph) return;
    
    // Extract unique categories from nodes
    const categories = new Set<string>();
    graph.nodes.forEach(node => {
      if (node.category) categories.add(node.category);
    });
    
    setAvailableCategories(Array.from(categories).sort());
  }, [graph]);

  const handleCategoryToggle = (category: string): void => {
    if (filterCategories.includes(category)) {
      setFilterCategories(filterCategories.filter(c => c !== category));
    } else {
      setFilterCategories([...filterCategories, category]);
    }
  };

  if (!graph || availableCategories.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      padding: '16px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Filter by Category</h3>
      {availableCategories.map(category => (
        <label key={category} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filterCategories.includes(category)}
            onChange={() => handleCategoryToggle(category)}
            style={{ marginRight: '8px' }}
          />
          {category}
        </label>
      ))}
    </div>
  );
};