import { FaCircleInfo } from "react-icons/fa6";
import CodeSnippet from "./CodeSnippet";
import { Snippet } from "../types/types";
import { useEffect, useRef, useState } from "react";
import snipsApi from "../api/snipsApi";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type SearchResultProps = {
	snip: Snippet;
	index: number;
};

const SearchResult = ({ snip, index }: SearchResultProps) => {
	const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
	const [fileContent, setFileContent] = useState<string>("");
	const contentRef = useRef<HTMLDivElement | null>(null);

	const fetchData = async () => {
		try {
			const data = await snipsApi.getFileContent(snip.metaData.actualFilePath);
			setFileContent(data);

			console.log(data);
		} catch (err) {
			console.log(err);
		}
	}

	const toggleInfo = () => {
		const newState = !isShowInfo;
		if (newState) {
			fetchData();
		}
		setIsShowInfo(newState);
	};

	useEffect(() => {
		if (isShowInfo && contentRef.current) {
			const headerLine = snip.metaData.headerLine || 0;
			const lines = fileContent.split('\n'); // Get total number of lines
			const totalLines = lines.length;

			// Calculate scroll distance
			const scrollDistance = (headerLine / totalLines) * (contentRef.current.scrollHeight - contentRef.current.clientHeight);
			contentRef.current.scrollTop = scrollDistance; // Set scroll position
		}
	}, [isShowInfo, fileContent, snip.metaData.headerLine]);

	useEffect(() => {
		setIsShowInfo(false);
	}, [snip]);

	return (
		<div key={index} className="mb-4 flex flex-row w-full justify-center items-stretch"> {/* Added items-stretch */}
		<div className={`bg-secondary p-4 rounded-lg shadow-md ${isShowInfo ? 'w-1/3' : 'w-[60%]'} flex-shrink-0`}>
			<div className="w-auto mb-4 flex flex-row justify-between items-center">
				<h3>Language: {snip.lang}</h3>
				<div className="p-2 bg-primary rounded-lg cursor-pointer" onClick={toggleInfo}>
					<FaCircleInfo size={20} />
				</div>
			</div>
			<pre>
				<CodeSnippet snip={snip} />
			</pre>
		</div>
		{isShowInfo && (
			<div className="bg-secondary p-4 rounded-lg shadow-md w-2/3 h-auto ml-2 flex flex-col">
				<p className="mb-2">File path: {snip.metaData.actualFilePath}</p>
				<div className="bg-primary" style={{ position: 'relative', padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}}>
					<div ref={contentRef} style={{ maxHeight: '500px', overflowY: 'auto' }}>
						<SyntaxHighlighter
							language="markdown"
							style={atomOneDark}
							customStyle={{ background: "transparent", flex: 1, fontWeight: 500, fontSize: 15 }}
							wrapLines
						>
							{fileContent}
						</SyntaxHighlighter>
					</div>
				</div>
			</div>
		)}
	</div>
	);

};

export default SearchResult;
