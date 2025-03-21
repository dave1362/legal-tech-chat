from backend.src.tools.contract_search_tool import ContractSearchTool
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition
from datetime import date

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")


def get_agent():
    # Define tools/llm
    tools = [ContractSearchTool()]
    llm_with_tools = llm.bind_tools(tools)

    # System message
    sys_msg = SystemMessage(
        content="You are a helpful assistant tasked with finding and explaining relevant information about internal contracts."
        "Always explain results you get from the tools in a concise manner to not overwhelm the user"
        "Answer questions as if you are answering to non-technical management level"
        "Important: Be confident and accurate in your tool choice! Avoid asking follow-up questions if possible"
        f"Today is {date.today()}"

    )

    # Node
    def assistant(state: MessagesState):
        return {"messages": [llm_with_tools.invoke([sys_msg] + state["messages"])]}

    # Graph
    builder = StateGraph(MessagesState)

    # Define nodes: these do the work
    builder.add_node("assistant", assistant)
    builder.add_node("tools", ToolNode(tools))

    # Define edges: these determine how the control flow moves
    builder.add_edge(START, "assistant")
    builder.add_conditional_edges(
        "assistant",
        # If the latest message (result) from assistant is a tool call -> tools_condition routes to tools
        # If the latest message (result) from assistant is a not a tool call -> tools_condition routes to END
        tools_condition,
    )
    builder.add_edge("tools", "assistant")
    return builder.compile()
