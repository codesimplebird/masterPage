import yaml
import os
from pathlib import Path


FileFolderPath = (
    r"C:\Users\14834\AppData\Roaming\io.github.clash-verge-rev.clash-verge-rev\profiles"
)


def find_large_yaml_files(folder_path, min_size_kb=30):
    """
    查找文件夹下大于指定大小的 YAML 文件

    Args:
        folder_path: 文件夹路径
        min_size_kb: 最小文件大小（KB），默认30KB

    Returns:
        list: 符合条件的文件信息列表
    """
    large_files = []
    min_size_bytes = min_size_kb * 1024  # 转换为字节

    # 遍历文件夹
    folder = Path(folder_path)

    if not folder.exists():
        print(f"文件夹不存在: {folder_path}")
        return []

    # 查找所有 .yaml 和 .yml 文件
    yaml_files = list(folder.glob("*.yaml")) + list(folder.glob("*.yml"))

    print(f"找到 {len(yaml_files)} 个 YAML 文件")

    # 筛选大于 30KB 的文件
    for yaml_file in yaml_files:
        file_size = yaml_file.stat().st_size  # 文件大小（字节）
        file_size_kb = file_size / 1024  # 转换为 KB

        if file_size > min_size_bytes:
            # 获取文件信息
            file_info = {
                "name": yaml_file.name,
                "path": str(yaml_file.absolute()),
                "size_bytes": file_size,
                "size_kb": round(file_size_kb, 2),
            }
            large_files.append(file_info)

    return large_files


def list_large_yaml_files(folder_path, min_size_kb=30):
    """
    列出大于指定大小的 YAML 文件

    Args:
        folder_path: 文件夹路径
        min_size_kb: 最小文件大小（KB）
    """
    large_files = find_large_yaml_files(folder_path, min_size_kb)

    if not large_files:
        print(f"没有找到大于 {min_size_kb}KB 的 YAML 文件")
        return

    print(f"\n大于 {min_size_kb}KB 的 YAML 文件列表:")
    print("-" * 80)
    print(f"{'文件名':<30} {'大小(KB)':<15} {'路径'}")
    print("-" * 80)

    for file_info in large_files:
        print(f"{file_info['name']:<30} {file_info['size_kb']:<15} {file_info['path']}")

    print(f"\n总共找到 {len(large_files)} 个大文件")
    return large_files


def select_node_from_yaml(yaml_file_path):
    """
    从 YAML 文件中选择指定名称的节点

    Args:
        yaml_file_path: YAML 文件路径
        node_name: 节点名称

    Returns:
        dict: 节点信息，如果未找到则返回 None
    """
    keywords = [
        "香港",
        "日本",
        "台湾",
        "新加坡",
        "韩国",
        "JP",
        "SG",
        "HK",
        "TW",
        "KR",
    ]
    proxies_selected_list = []
    try:
        with open(yaml_file_path, "r", encoding="utf-8") as file:
            data = yaml.safe_load(file)
            proxies = data.get("proxies", [])
            for i in range(len(proxies)):
                if any(keyword in proxies[i].get("name", "") for keyword in keywords):

                    proxies_selected_list.append(proxies[i])
        return proxies_selected_list
    except Exception as e:
        print(f"读取文件 {yaml_file_path} 时出错: {e}")
    return None


if __name__ == "__main__":
    # 指定文件夹路径
    folder_path = FileFolderPath  # 修改为你的文件夹路径

    # 列出大于 30KB 的 YAML 文件
    large_yaml_files = list_large_yaml_files(folder_path, 30)

    # list_large_yaml_files 数据格式  "name : '文件名', 'size_kb': 文件大小(KB), 'path': '文件路径'"
    all_proxies = []
    for item in large_yaml_files:
        proxies_selected = select_node_from_yaml(item["path"])
        all_proxies.extend(proxies_selected)
    names = [proxy.get("name") for proxy in all_proxies if "name" in proxy]
    unique_sorted_names = tuple(sorted(set(names)))
    with open("test.yaml", "r", encoding="utf-8") as file:
        data = yaml.safe_load(file)
        data["proxies"] = all_proxies
        with open("test.yaml", "w", encoding="utf-8") as file:
            yaml.safe_dump(data, file, allow_unicode=True, default_flow_style=False)

    with open("test.yaml", "r", encoding="utf-8") as file:
        data = yaml.safe_load(file)
        data["proxy-groups"][0]["proxies"] = unique_sorted_names
        with open("test.yaml", "w", encoding="utf-8") as file:
            yaml.safe_dump(data, file, allow_unicode=True, default_flow_style=False)

    # 如果需要进一步处理这些文件
    # for file_info in large_yaml_files:
    #     print(f"\n处理文件: {file_info['name']}")
    #     try:
    #         with open(file_info['path'], 'r', encoding='utf-8') as file:
    #             data = yaml.safe_load(file)
    #             print(f"  - 文件内容项数: {len(data) if isinstance(data, dict) else 'N/A'}")
    #     except Exception as e:
    #         print(f"  - 读取错误: {e}")
