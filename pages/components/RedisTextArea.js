
import { Textarea, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {CloseIcon} from "@chakra-ui/icons";
import { FaPencilAlt } from "react-icons/fa";

const RenderTextArea = ({ data, index ,key,onDelete ,onSave }) => {
  const [text, setText] = useState(data);
  const [isClient, setIsClient] = useState(false);
  const [fontSize, setFontSize] = useState("14px");

  useEffect(() => {
    setIsClient(true);
    // Window width에 따라 폰트 크기를 조절
    const width = window.innerWidth;
    if (width <= 480) {
      setFontSize("14px");
    } else if (width <= 768) {
      setFontSize("16px");
    } else if (width <= 992) {
      setFontSize("18px");
    } else if (width <= 1200) {
      setFontSize("20px");
    } else {
      setFontSize("22px");
    }
  }, []);

  const EditData = (event) => {
    console.log("EditData", key);
  };
  const handleChange = (event) => {
    setText(event.target.value);
  };


  const DeleteData = () => {
    onDelete();
  };
  const SaveData = (index) => {
    //console.log('savedata',text,index)
    console.log(onSave(text,key));

  };
  return (
    <div style={{ height: "30%" }}>
      <Textarea
        value={text}
        onChange={handleChange}
        width="90%"
        height="90%"
        padding="10px"
        fontSize={isClient ? fontSize : "14px"}
        border="1px solid #ccc"
        borderRadius="4px"
        boxShadow="1px 1px 5px rgba(0, 0, 0, 0.1)"
        resize="none"
      />
      <IconButton
        key={index}
        icon={<CloseIcon />}
        aria-label="Delete"
        onClick={() => DeleteData()}
      />
      <IconButton icon={<FaPencilAlt />} aria-label="Edit" 
       onClick={() => SaveData(text)} />
    </div>
  );
};

export default RenderTextArea;
