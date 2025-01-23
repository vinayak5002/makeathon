import { FaCircleInfo } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import CodeSnippet from "./CodeSnippet";
import { ChatMessage, QueryType } from "../types/types";
import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { Oval } from "react-loader-spinner";
import { generateHtmlTable } from "../utils/utils";

type SearchResultProps = {
	chatMessage: ChatMessage;
	index: number;
};

const SearchResult = ({ chatMessage, index }: SearchResultProps) => {
	const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
	const [isShowExec, setIsShowExec] = useState<boolean>(false);

	const [isQuerDescLoading, setIsQueryDescLoading] = useState<boolean>(false);
	const [queryDesc, setQueryDesc] = useState<string>("");

	const [isExecLoading, setIsExecLoading] = useState<boolean>(false);
	const [execResult, setExecResult] = useState<string>("");

	const contentRef = useRef<HTMLDivElement | null>(null);

	const fetchData = async () => {
		try {
			setIsQueryDescLoading(true);

			const data = await api.sendSQL2Textquery(chatMessage.answer);

			setIsQueryDescLoading(false);

			setQueryDesc(data.description);

			console.log(data);
		} catch (err) {
			console.log(err);
		}
	}

	const fetchQueryExecResult = async () => {
		try {
			setIsExecLoading(true);

			console.log("Fetching data...");

			const data = await api.executeQuery(chatMessage.answer);

			setExecResult(generateHtmlTable(data));

			setIsExecLoading(false);
		}
		catch (err) {
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

	const toggleExecute = () => {
		const newState = !isShowExec;
		if (newState) {
			fetchQueryExecResult();
		}
		setIsShowExec(newState);
	}

	useEffect(() => {
		setIsShowInfo(false);
	}, [chatMessage]);

	return (
		<div key={index} className="mb-4 flex flex-row w-full justify-center items-stretch"> {/* Added items-stretch */}
			<div className={`bg-secondary p-4 rounded-lg shadow-md ${isShowInfo ? 'w-1/3' : 'w-[60%]'} flex-shrink-0`}>
				<div className="w-auto mb-4 flex flex-row justify-between items-center">
					<h3>Question: {chatMessage.question}</h3>
					<div className="flex flex-row">
						<div className={`${chatMessage.type === QueryType.SQL2TEXT && "hidden"} p-2 bg-primary rounded-lg cursor-pointer mr-2`} onClick={toggleExecute}>
							<FaPlayCircle size={20} />
						</div>
						<div className={`${chatMessage.type === QueryType.SQL2TEXT && "hidden"} p-2 bg-primary rounded-lg cursor-pointer`} onClick={toggleInfo}>
							<FaCircleInfo size={20} />
						</div>
					</div>
				</div>
				<pre>
					{
						chatMessage.type === QueryType.TEXT2SQL ?
							<CodeSnippet snip={chatMessage.answer} /> :
							chatMessage.answer
					}
				</pre>

				{
					isShowExec && (
						<div className="">
							<h2>Execution result:</h2>
							{
								isExecLoading ?
									<Oval
										visible={true}
										height="30"
										width="30"
										color="#ffffff"
										secondaryColor="#444444"
										ariaLabel="tail-spin-loading"
										wrapperStyle={{}}
										wrapperClass=""
									/>
									:
									<pre>
										<div dangerouslySetInnerHTML={{ __html: execResult }} />
									</pre>
							}
						</div>
					)
				}

			</div>
			{isShowInfo && (
				<div className="bg-secondary p-4 rounded-lg shadow-md w-2/3 h-auto ml-2 flex flex-col">
					<p className="mb-2">Query explanation: </p>
					{
						isQuerDescLoading ?

							<Oval
								visible={true}
								height="30"
								width="30"
								color="#ffffff"
								secondaryColor="#444444"
								ariaLabel="tail-spin-loading"
								wrapperStyle={{}}
								wrapperClass=""
							/>
							:
							<div className="bg-primary" style={{ position: 'relative', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
								<div ref={contentRef} style={{ maxHeight: '500px', overflowY: 'auto' }}>
									{queryDesc}
								</div>
							</div>
					}
				</div>
			)}
		</div>
	);

};

export default SearchResult;
