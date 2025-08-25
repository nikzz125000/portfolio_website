import { useEffect, useState } from "react";
import { useSaveBackGroundColor } from "../../../api/webSettings/useSaveBackgroundColor";
import { useNotification } from "../../../components/Tostr";
import { useGetBackgroundColor } from "../../../api/webSettings/useGetBackgroundColor";


interface GradientStop {
  color: string;
  position: number;
}

type Page = "home" | "project-details" | "resume" | "footer";

export default function GradientEditor() {
  const defaultGradientStops: GradientStop[] = [
    { color: "#6e226e", position: 0 },
    { color: "#a5206a", position: 14 },
    { color: "#d31663", position: 28 },
    { color: "#ed3176", position: 42 },
    { color: "#fd336b", position: 56 },
    { color: "#f23d64", position: 70 },
    { color: "#f65d55", position: 84 },
    { color: "#f5655d", position: 100 },
  ];

 

  const [gradientStops, setGradientStops] = useState<GradientStop[]>(defaultGradientStops);
  
  const [direction, setDirection] = useState<number>(90);
  const [currentId, setCurrentId] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<Page>("home");
  const [, setSavedGradient] = useState<string>("");
const { showNotification } = useNotification();  

   const { mutate: addOrUpdateBackgroundColor, isPending: isSaving } = useSaveBackGroundColor();

	 const { data: backgroundColor } = useGetBackgroundColor(selectedPage);

 useEffect(() => {
  if (backgroundColor?.data) {
    try {
      const gradientStr = backgroundColor.data?.gradient;

      if (gradientStr && gradientStr.trim() !== "") {
        const parsedGradient = JSON.parse(gradientStr);
        console.log("Parsed Gradient:", parsedGradient);

        setGradientStops(parsedGradient);
      } else {
        // fallback to default if nothing stored
        setGradientStops(defaultGradientStops);
      }

      setCurrentId(backgroundColor?.data?.backgroundColorSettingId || 0);
    } catch (err) {
      console.error("Invalid gradient JSON:", err);
      setGradientStops(defaultGradientStops);
    }
  }else{
    setGradientStops(defaultGradientStops);
    setCurrentId(0);
  }
}, [backgroundColor]);
     

  const generateGradientString = (): string => {
    const stopsString = gradientStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");
    return `linear-gradient(${direction}deg, ${stopsString})`;
  };

  const updateColor = (index: number, newColor: string): void => {
    const newStops = [...gradientStops];
    newStops[index].color = newColor;
    setGradientStops(newStops);
  };

  const updatePosition = (index: number, newPosition: number): void => {
    const newStops = [...gradientStops];
    newStops[index].position = Math.max(0, Math.min(100, newPosition));
    setGradientStops(newStops);
  };

  const addStop = (): void => {
    const newPosition =
      gradientStops.length > 0
        ? Math.min(100, gradientStops[gradientStops.length - 1].position + 10)
        : 50;

    setGradientStops([...gradientStops, { color: "#ff0000", position: newPosition }]);
  };

  const removeStop = (index: number): void => {
    if (gradientStops.length > 2) {
      setGradientStops(gradientStops.filter((_, i) => i !== index));
    }
  };

  const handleSave = async() => {
    const gradientString = await generateGradientString();
    setSavedGradient(gradientString);
    
    const data={     
  "createdDate": "2025-08-25T07:48:18.250Z",
  "updatedDate": "2025-08-25T07:48:18.250Z",
  "backgroundColorSettingId": currentId,
  "title":selectedPage,
  "backgroundColor":gradientString,
  gradient:JSON.stringify(gradientStops)
    }

    addOrUpdateBackgroundColor(data, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (res: any) => {
              if (res?.isSuccess) {
                  showNotification("Background color saved successfully!", "success", "Success");

              } else {
                  showNotification(
                      res?.message || "Failed to save container",
                      "error",
                      "Error"
                  );
              }
          },
      });
  };

  

  const resetToDefault = (): void => {
    setGradientStops([...defaultGradientStops]);
    setDirection(90);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gradient Editor</h2>

      {/* Page Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Page:
        </label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value as Page)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="home">Home</option>
          <option value="project-details">Project Details</option>
          <option value="resume">Resume</option>
          <option value="footer">Footer</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Editing gradient for:{" "}
          <span className="font-semibold capitalize">
            {selectedPage.replace("-", " ")}
          </span>
        </p>
      </div>

      {/* Live Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Live Preview</h3>
        <div
          className="w-full h-32 rounded-lg border-2 border-gray-300"
          style={{ background: generateGradientString() }}
        ></div>
      </div>

      {/* Direction Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Direction: {direction}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={direction}
          onChange={(e) => setDirection(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Color Stops */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Color Stops</h3>
          <button
            onClick={addStop}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Stop
          </button>
        </div>

        <div className="space-y-3">
          {gradientStops.map((stop, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Color:</label>
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Position:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) =>
                    updatePosition(index, parseInt(e.target.value) || 0)
                  }
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>

              {gradientStops.length > 2 && (
                <button
                  onClick={() => removeStop(index)}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
            disabled={isSaving}
          >
            Save Gradient
          </button>
          <button
            onClick={resetToDefault}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
